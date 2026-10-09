package com.pkmncomparator.service;

import com.pkmncomparator.model.CardModel;
import com.pkmncomparator.model.SetModel;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PokemonTcgApiService {

    private static final Logger log = LoggerFactory.getLogger(PokemonTcgApiService.class);

    private static final String SETS_URL =
            "https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/sets/en.json";
    private static final String CARDS_BASE_URL =
            "https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/cards/en/";

    private final RestTemplate restTemplate;

    private volatile List<SetModel> setsCache = List.of();
    private final Map<String, List<CardModel>> cardsBySetCache = new ConcurrentHashMap<>();
    private volatile List<CardModel> allCardsIndex = List.of();

    public PokemonTcgApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    public void init() {
        new Thread(this::loadAllData).start();
    }

    private void loadAllData() {
        try {
            log.info("Loading sets from GitHub...");
            SetModel[] sets = restTemplate.getForObject(SETS_URL, SetModel[].class);
            if (sets == null) return;

            List<SetModel> sorted = Arrays.stream(sets)
                    .sorted(Comparator.comparing(SetModel::releaseDate).reversed())
                    .collect(Collectors.toList());
            setsCache = sorted;
            log.info("Loaded {} sets. Loading cards...", sorted.size());

            List<CardModel> allCards = new ArrayList<>();
            for (SetModel set : sorted) {
                try {
                    String url = CARDS_BASE_URL + set.id() + ".json";
                    CardModel[] rawCards = restTemplate.getForObject(url, CardModel[].class);
                    if (rawCards != null) {
                        List<CardModel> enriched = Arrays.stream(rawCards)
                                .map(c -> c.withSet(set))
                                .collect(Collectors.toList());
                        cardsBySetCache.put(set.id(), enriched);
                        allCards.addAll(enriched);
                    }
                } catch (Exception e) {
                    log.warn("Failed to load cards for set {}: {}", set.id(), e.getMessage());
                }
            }
            allCards.add(mockedPlaceholderCard());
            allCardsIndex = allCards;
            log.info("Card index ready: {} total cards", allCards.size());
        } catch (Exception e) {
            log.error("Failed to load TCG data", e);
        }
    }

    public List<SetModel> getAllSets() {
        return setsCache;
    }

    public List<CardModel> getCardsBySet(String setId) {
        return cardsBySetCache.getOrDefault(setId, List.of());
    }

    public List<CardModel> searchCards(String query) {
        String q = query.toLowerCase(Locale.ROOT);
        return allCardsIndex.stream()
                .filter(c -> c.name() != null && c.name().toLowerCase(Locale.ROOT).contains(q))
                .limit(20)
                .collect(Collectors.toList());
    }

    private CardModel mockedPlaceholderCard() {
        CardModel.SetImages si = new CardModel.SetImages(null, null);
        CardModel.SetSummary ss = new CardModel.SetSummary(
                "mock-set", "Mock Set", "Mock", "10", "2099-01-01", si);
        CardModel.CardImages ci = new CardModel.CardImages(
                "https://images.pokemontcg.io/base1/4.png",
                "https://images.pokemontcg.io/base1/4_hires.png");
        return new CardModel("mock-placeholder-1", "Mocked Placeholder", "1", "Rare Holo", ci, ss);
    }

    public boolean isReady() {
        return !allCardsIndex.isEmpty();
    }
}
