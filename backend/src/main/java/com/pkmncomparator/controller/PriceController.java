package com.pkmncomparator.controller;

import com.pkmncomparator.dto.PriceLink;
import com.pkmncomparator.service.PriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
public class PriceController {

    private final PriceService priceService;

    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @GetMapping
    public ResponseEntity<List<PriceLink>> getPriceLinks(
            @RequestParam String cardName,
            @RequestParam(defaultValue = "") String setName,
            @RequestParam(defaultValue = "") String cardNumber) {
        return ResponseEntity.ok(priceService.getPriceLinks(cardName, setName, cardNumber));
    }
}
