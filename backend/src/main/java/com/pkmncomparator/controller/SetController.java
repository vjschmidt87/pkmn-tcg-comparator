package com.pkmncomparator.controller;

import com.pkmncomparator.model.CardModel;
import com.pkmncomparator.model.SetModel;
import com.pkmncomparator.service.PokemonTcgApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sets")
public class SetController {

    private final PokemonTcgApiService tcgApiService;

    public SetController(PokemonTcgApiService tcgApiService) {
        this.tcgApiService = tcgApiService;
    }

    @GetMapping
    public ResponseEntity<List<SetModel>> getAllSets() {
        return ResponseEntity.ok(tcgApiService.getAllSets());
    }

    @GetMapping("/{setId}/cards")
    public ResponseEntity<List<CardModel>> getCardsBySet(@PathVariable String setId) {
        return ResponseEntity.ok(tcgApiService.getCardsBySet(setId));
    }
}
