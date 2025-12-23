package com.balaji.finance.masterInfo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.dto.PersonalInfoAutoCompletePojo;
import com.balaji.finance.dto.PersonalInfoDto;
import com.balaji.finance.masterInfo.service.PersonalInfoService;

@RestController
@RequestMapping("/PersonalInfo")
public class PersonalInfoController {

	@Autowired
	private PersonalInfoService personalInfoService;

	@GetMapping("/createNewPersonalInfoTemplate/{personType}")
	public ResponseEntity<PersonalInfoDto> createNewPersonalInfoTemplate(String personType) {

		PersonalInfoDto personalInfoDto = personalInfoService.createPersonalInfoDto(personType);

		return ResponseEntity.ok().body(personalInfoDto);
	}

	@PostMapping("/updatePersonalInfo/{personType}")
	public ResponseEntity<String> updatePersonalInfoTemplate(@RequestBody PersonalInfoDto personalInfoDto,
			String personType) {

		String response = null;

		if (personalInfoDto.getId() == null || personalInfoDto.getId().isBlank()) {
			response = personalInfoService.savePersonalInfoDto(personalInfoDto, personType);
		} else {
			response = personalInfoService.updatePersonalInfoDto(personalInfoDto);
		}

		return ResponseEntity.ok().body(response);
	}

	@DeleteMapping("/deletePersonalInfo/{id}")
	public ResponseEntity<String> deletePersonalInfoTemplate(String id) {

		String response = personalInfoService.deletePersonalInfoDto(id);

		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/findPersonalInfoById/{id}")
	public ResponseEntity<PersonalInfoDto> findPersonalInfoById(String id) {

		PersonalInfoDto personalInfoDto = personalInfoService.findById(id);

		return ResponseEntity.ok().body(personalInfoDto);
	}

	@GetMapping("/findAll")
	public ResponseEntity<List<PersonalInfoDto>> findAll() {

		List<PersonalInfoDto> all = personalInfoService.findAll();

		return ResponseEntity.ok().body(all);
	}

	@GetMapping("/autocomplete")
	public ResponseEntity<List<PersonalInfoAutoCompletePojo>> autocomplete(@RequestParam String q) {

		List<PersonalInfoAutoCompletePojo> all = personalInfoService.autocomplete(q);

		return ResponseEntity.ok().body(all);

	}

}
