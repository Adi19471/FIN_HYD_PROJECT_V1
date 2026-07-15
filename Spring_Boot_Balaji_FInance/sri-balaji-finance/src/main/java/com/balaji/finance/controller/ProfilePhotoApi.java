package com.balaji.finance.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.service.PersonalInfoService;

@RestController
@RequestMapping("/profile-photo")
public class ProfilePhotoApi {

	@Autowired
	private PersonalInfoService personalInfoService;

	@PostMapping("/{personalInfoId}/profile-pic")
	public ResponseEntity<String> uploadProfilePic(@PathVariable String personalInfoId,
			@RequestParam("file") MultipartFile file) throws IOException {

		personalInfoService.uploadProfilePic(personalInfoId, file);

		return ResponseEntity.ok("Profile picture uploaded successfully");
	}

	@GetMapping("/{personalInfoId}/profile-pic")
	public ResponseEntity<byte[]> getProfilePic(@PathVariable String personalInfoId) {

		PersonalInfo personalInfo = personalInfoService.getProfilePic(personalInfoId);

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(personalInfo.getProfilePicContentType()))
				.body(personalInfo.getProfilePic());
	}
}