package com.example.backend.services.ai;

import java.util.List;

import com.example.backend.dto.CitationDto;

public record RetrievedContext(
    List<CitationDto> citations,
    String contextText
) {
    
}
