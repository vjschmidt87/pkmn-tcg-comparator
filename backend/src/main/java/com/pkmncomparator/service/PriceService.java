package com.pkmncomparator.service;

import com.pkmncomparator.dto.PriceLink;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class PriceService {

    public List<PriceLink> getPriceLinks(String cardName, String setName, String cardNumber) {
        String encodedFull = UriUtils.encode(cardName + " " + setName, StandardCharsets.UTF_8);
        String encodedEbay = UriUtils.encode(cardName + " " + setName + " " + cardNumber + " pokemon card", StandardCharsets.UTF_8);
        String encodedName = UriUtils.encode(cardName, StandardCharsets.UTF_8);

        return List.of(
                new PriceLink(
                        "TCGPlayer",
                        "https://www.tcgplayer.com/search/pokemon/product?q=" + encodedFull,
                        "US",
                        "marketplace"
                ),
                new PriceLink(
                        "CardMarket",
                        "https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=" + encodedFull,
                        "EU",
                        "marketplace"
                ),
                new PriceLink(
                        "Troll & Toad",
                        "https://www.trollandtoad.com/pokemon/all-pokemon-singles/1?Keywords=" + encodedFull + "&sortByPriceAsc=1",
                        "US",
                        "marketplace"
                ),
                new PriceLink(
                        "eBay",
                        "https://www.ebay.com/sch/i.html?_nkw=" + encodedEbay + "&LH_BIN=1&_sop=15",
                        "Global",
                        "marketplace"
                ),
                new PriceLink(
                        "LigaPokemon",
                        "https://www.ligapokemon.com.br/?view=cards/card&card=" + encodedName,
                        "BR",
                        "marketplace"
                ),
                new PriceLink(
                        "PokeGoldfish",
                        "https://www.pokegoldfish.com/pokemon/search?q=" + encodedFull,
                        "US",
                        "tracker"
                ),
                new PriceLink(
                        "PokéCardex",
                        "https://www.pokecardex.com/search?q=" + encodedFull,
                        "EU",
                        "tracker"
                )
        );
    }
}
