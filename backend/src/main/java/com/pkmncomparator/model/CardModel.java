package com.pkmncomparator.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CardModel(
        String id,
        String name,
        String number,
        String rarity,
        CardImages images,
        SetSummary set
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CardImages(String small, String large) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SetSummary(String id, String name, String series, String printedTotal, String releaseDate, SetImages images) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SetImages(String symbol, String logo) {}

    public CardModel withSet(SetModel setModel) {
        SetImages si = new SetImages(
                setModel.images() != null ? setModel.images().symbol() : null,
                setModel.images() != null ? setModel.images().logo() : null
        );
        SetSummary ss = new SetSummary(
                setModel.id(),
                setModel.name(),
                setModel.series(),
                String.valueOf(setModel.printedTotal()),
                setModel.releaseDate(),
                si
        );
        return new CardModel(this.id, this.name, this.number, this.rarity, this.images, ss);
    }
}
