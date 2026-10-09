package com.pkmncomparator.dto;

public record PriceLink(
        String marketplace,
        String url,
        String region,
        String category
) {}
