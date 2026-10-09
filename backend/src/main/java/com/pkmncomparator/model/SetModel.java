package com.pkmncomparator.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SetModel(
        String id,
        String name,
        String series,
        int printedTotal,
        int total,
        String releaseDate,
        SetImages images
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SetImages(String symbol, String logo) {}
}
