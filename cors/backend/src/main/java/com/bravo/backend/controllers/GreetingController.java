package com.bravo.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import com.bravo.backend.dtos.ContentDto;


@RestController
public class GreetingController {

	@GetMapping("/greeting")
	public ResponseEntity<ContentDto> greeting() {

		return ResponseEntity.ok(new ContentDto("hello from Backend"));

	}
	
}
