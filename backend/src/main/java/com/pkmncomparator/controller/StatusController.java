package com.pkmncomparator.controller;

import com.pkmncomparator.service.PokemonTcgApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    private final PokemonTcgApiService tcgApiService;

    public StatusController(PokemonTcgApiService tcgApiService) {
        this.tcgApiService = tcgApiService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> status() {
        boolean ready = tcgApiService.isReady();
        return ResponseEntity.ok(Map.of(
                "ready", ready,
                "sets", tcgApiService.getAllSets().size()
        ));
    }
}
