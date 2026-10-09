package com.pkmncomparator.controller;

import com.pkmncomparator.model.CardModel;
import com.pkmncomparator.service.PokemonTcgApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final PokemonTcgApiService tcgApiService;

    public CardController(PokemonTcgApiService tcgApiService) {
        this.tcgApiService = tcgApiService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<CardModel>> searchCards(@RequestParam String q) {
        if (q == null || q.trim().length() < 3) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(tcgApiService.searchCards(q.trim()));
    }
}
