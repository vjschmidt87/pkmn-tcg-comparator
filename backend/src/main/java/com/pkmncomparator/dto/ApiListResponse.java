package com.pkmncomparator.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiListResponse<T>(List<T> data, int count, int totalCount, int page, int pageSize) {}
