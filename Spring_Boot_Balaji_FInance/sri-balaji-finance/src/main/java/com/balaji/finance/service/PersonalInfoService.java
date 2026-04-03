package com.balaji.finance.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.PersonalInfoAutoCompletePojo;
import com.balaji.finance.dto.PersonalInfoDto;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.repo.AccountMasterRepo;
import com.balaji.finance.repo.PersonalInfoRepository;
import com.balaji.finance.util.PersonalSequenceService;

@Service
public class PersonalInfoService {

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	@Autowired
	private PersonalSequenceService personalSequenceService;
	
	@Autowired
	private AccountMasterRepo accountMasterRepo;
	
	

	// create
	public PersonalInfoDto createPersonalInfoDto(String type) {

		PersonalInfoDto personalInfoDto = new PersonalInfoDto();

		return personalInfoDto;

	}

	// create
	public String savePersonalInfoDto(PersonalInfoDto personalInfoDto,String type) {

		PersonalInfo personalInfo = new PersonalInfo();
		
		String prefix;
		switch (type) {
		case "PARTNER":
			prefix = "P";

			break;

		case "CUSTOMER":
			prefix = "C";
			break;

		case "EMPLOYEE":
			prefix = "E";
			break;

		case "VENDOR":
			prefix = "V";
			break;

		default:
			throw new IllegalArgumentException("Unknown type: " + type);
		}

		long seq = 0;
		seq = personalSequenceService.getNextSequence(type);

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
		
		personalInfo.setPersonalInfoId(prefix + "" + seq);
		personalInfo.setSequence(seq);
		
		personalInfo.setCreatedDate(LocalDateTime.now());
		personalInfo.setModifiedDate(LocalDateTime.now());
		
		personalInfo.setCreatedUser(currentUser);
		personalInfo.setModifiedUser(currentUser);
		
		
		personalInfo.setFirstName(personalInfoDto.getFirstname());
		personalInfo.setLastName(personalInfoDto.getLastname());
		personalInfo.setGender(personalInfoDto.getGender());
		personalInfo.setAge(personalInfoDto.getAge());
		
		
		personalInfo.setFatherName(personalInfoDto.getFathername());
		personalInfo.setSpouse(personalInfoDto.getSpouse());

		personalInfo.setOccupation(personalInfoDto.getOccupation());
		
		
		personalInfo.setAddress(personalInfoDto.getAddress());
		personalInfo.setMobile(personalInfoDto.getMobile());
		personalInfo.setPhone(personalInfoDto.getPhone());
		personalInfo.setAddress2(personalInfoDto.getAddress2());
		personalInfo.setMobile2(personalInfoDto.getMobile2());
		personalInfo.setPhone2(personalInfoDto.getPhone2());
		
		
		personalInfo.setReference(personalInfoDto.getReference());
		personalInfo.setIdProof(personalInfoDto.getIdproof());
		personalInfo.setIdProoftype(personalInfoDto.getIdprooftype());
		
		personalInfo.setShares(personalInfoDto.getShares());
		personalInfo.setLoanlimit(personalInfoDto.getLoanlimit());

		personalInfo.setBussinessExemption(personalInfoDto.isBussinessexemption());
		personalInfo.setIntroname(personalInfoDto.getIntroname());

		personalInfo.setOldId(personalInfoDto.getOldid());
		personalInfo.setCategory(type);
		personalInfo.setDisable(personalInfoDto.isDisable());
		
		personalInfoRepository.save(personalInfo);

		return "Sucessfully Saved ";
	}

	// update
	public String updatePersonalInfoDto(PersonalInfoDto personalInfoDto) {

		Optional<PersonalInfo> personalInfoInDb = personalInfoRepository.findById(personalInfoDto.getId());

		if (personalInfoInDb.isPresent()) {

			PersonalInfo personalInfo = personalInfoInDb.get();
			
			personalInfo.setFirstName(personalInfoDto.getFirstname());
			personalInfo.setLastName(personalInfoDto.getLastname());
			personalInfo.setGender(personalInfoDto.getGender());
			personalInfo.setAge(personalInfoDto.getAge());
			
			
			personalInfo.setFatherName(personalInfoDto.getFathername());
			personalInfo.setSpouse(personalInfoDto.getSpouse());

			personalInfo.setOccupation(personalInfoDto.getOccupation());
			
			
			personalInfo.setAddress(personalInfoDto.getAddress());
			personalInfo.setMobile(personalInfoDto.getMobile());
			personalInfo.setPhone(personalInfoDto.getPhone());
			personalInfo.setAddress2(personalInfoDto.getAddress2());
			personalInfo.setMobile2(personalInfoDto.getMobile2());
			personalInfo.setPhone2(personalInfoDto.getPhone2());
			
			
			personalInfo.setReference(personalInfoDto.getReference());
			personalInfo.setIdProof(personalInfoDto.getIdproof());
			personalInfo.setIdProoftype(personalInfoDto.getIdprooftype());
			
			personalInfo.setShares(personalInfoDto.getShares());
			personalInfo.setLoanlimit(personalInfoDto.getLoanlimit());

			personalInfo.setBussinessExemption(personalInfoDto.isBussinessexemption());
			personalInfo.setIntroname(personalInfoDto.getIntroname());

			personalInfo.setOldId(personalInfoDto.getOldid());
			personalInfo.setDisable(personalInfoDto.isDisable());
			
			
			
			personalInfoRepository.save(personalInfo);

			return "Sucessfully Updated ";

		} else {

			return "Record Not Found ";

		}

	}

	// delete
	public String deletePersonalInfoDto(String id) {

		Optional<PersonalInfo> personalInfoInDb = personalInfoRepository.findById(id);

		if (personalInfoInDb.isPresent()) {

			PersonalInfo personalInfo = personalInfoInDb.get();
			personalInfo.setDisable(true);

			personalInfoRepository.save(personalInfo);

			return "Sucessfully Deleted " + personalInfo.getPersonalInfoId();

		} else {

			return "Record Not Found " + id;

		}

	}

	// findAll
	public List<PersonalInfoDto> findAll() {

		List<PersonalInfo> allPersonalInfoList = personalInfoRepository.findAllActiveRecords(false);

		List<PersonalInfoDto> toBeReturnedDtoList = new ArrayList<PersonalInfoDto>();

		allPersonalInfoList.stream().forEach(p -> {

			PersonalInfoDto personalInfoDto = new PersonalInfoDto();
			personalInfoDto.setId(p.getPersonalInfoId());
			
			
			personalInfoDto.setFirstname(p.getFirstName());
			personalInfoDto.setLastname(p.getLastName());
			personalInfoDto.setGender(p.getGender());
			personalInfoDto.setAge(p.getAge());
			
			
			personalInfoDto.setFathername(p.getFatherName());
			personalInfoDto.setSpouse(p.getSpouse());

			personalInfoDto.setOccupation(p.getOccupation());
			
			
			personalInfoDto.setAddress(p.getAddress());
			personalInfoDto.setMobile(p.getMobile());
			personalInfoDto.setPhone(p.getPhone());
			personalInfoDto.setAddress2(p.getAddress2());
			personalInfoDto.setMobile2(p.getMobile2());
			personalInfoDto.setPhone2(p.getPhone2());
			
			
			personalInfoDto.setReference(p.getReference());
			personalInfoDto.setIdproof(p.getIdProof());
			personalInfoDto.setIdprooftype(p.getIdProoftype());
			
			personalInfoDto.setShares(p.getShares());
			personalInfoDto.setLoanlimit(p.getLoanlimit());

			personalInfoDto.setBussinessexemption(p.isBussinessExemption());
			personalInfoDto.setIntroname(p.getIntroname());

			personalInfoDto.setOldid(p.getOldId());
			personalInfoDto.setCategory(p.getCategory());
			personalInfoDto.setDisable(p.isDisable());
			
			
			toBeReturnedDtoList.add(personalInfoDto);

		});

		return toBeReturnedDtoList;
	}

	// findAll
	public List<PersonalInfoDto> findByIds(String id) {

		List<String> asList = Arrays.asList(id.split(","));

		List<PersonalInfo> personalInfo = personalInfoRepository.findByIds(asList);

		List<PersonalInfoDto> returnList = new ArrayList<PersonalInfoDto>();
		for (PersonalInfo personalInfoDbObject : personalInfo) {

			PersonalInfoDto personalInfoDto = new PersonalInfoDto();
			personalInfoDto.setId(personalInfoDbObject.getPersonalInfoId());

			personalInfoDto.setFirstname(personalInfoDbObject.getFirstName());
			personalInfoDto.setLastname(personalInfoDbObject.getLastName());
			personalInfoDto.setGender(personalInfoDbObject.getGender());
			personalInfoDto.setAge(personalInfoDbObject.getAge());

			personalInfoDto.setFathername(personalInfoDbObject.getFatherName());
			personalInfoDto.setSpouse(personalInfoDbObject.getSpouse());

			personalInfoDto.setOccupation(personalInfoDbObject.getOccupation());

			personalInfoDto.setAddress(personalInfoDbObject.getAddress());
			personalInfoDto.setMobile(personalInfoDbObject.getMobile());
			personalInfoDto.setPhone(personalInfoDbObject.getPhone());
			personalInfoDto.setAddress2(personalInfoDbObject.getAddress2());
			personalInfoDto.setMobile2(personalInfoDbObject.getMobile2());
			personalInfoDto.setPhone2(personalInfoDbObject.getPhone2());

			personalInfoDto.setReference(personalInfoDbObject.getReference());
			personalInfoDto.setIdproof(personalInfoDbObject.getIdProof());
			personalInfoDto.setIdprooftype(personalInfoDbObject.getIdProoftype());

			personalInfoDto.setShares(personalInfoDbObject.getShares());
			personalInfoDto.setLoanlimit(personalInfoDbObject.getLoanlimit());

			personalInfoDto.setBussinessexemption(personalInfoDbObject.isBussinessExemption());
			personalInfoDto.setIntroname(personalInfoDbObject.getIntroname());

			personalInfoDto.setOldid(personalInfoDbObject.getOldId());
			personalInfoDto.setCategory(personalInfoDbObject.getCategory());
			personalInfoDto.setDisable(personalInfoDbObject.isDisable());

			returnList.add(personalInfoDto);

		}
		return returnList;

	}
	
	// findAll
	public PersonalInfoDto findById(String id) {

		Optional<PersonalInfo> personalInfo = personalInfoRepository.findById(id);

		if (personalInfo.isPresent()) {

			PersonalInfo personalInfoDbObject = personalInfo.get();



			PersonalInfoDto personalInfoDto = new PersonalInfoDto();
			personalInfoDto.setId(personalInfoDbObject.getPersonalInfoId());
			
			
			personalInfoDto.setFirstname(personalInfoDbObject.getFirstName());
			personalInfoDto.setLastname(personalInfoDbObject.getLastName());
			personalInfoDto.setGender(personalInfoDbObject.getGender());
			personalInfoDto.setAge(personalInfoDbObject.getAge());
			
			
			personalInfoDto.setFathername(personalInfoDbObject.getFatherName());
			personalInfoDto.setSpouse(personalInfoDbObject.getSpouse());

			personalInfoDto.setOccupation(personalInfoDbObject.getOccupation());
			
			
			personalInfoDto.setAddress(personalInfoDbObject.getAddress());
			personalInfoDto.setMobile(personalInfoDbObject.getMobile());
			personalInfoDto.setPhone(personalInfoDbObject.getPhone());
			personalInfoDto.setAddress2(personalInfoDbObject.getAddress2());
			personalInfoDto.setMobile2(personalInfoDbObject.getMobile2());
			personalInfoDto.setPhone2(personalInfoDbObject.getPhone2());
			
			
			personalInfoDto.setReference(personalInfoDbObject.getReference());
			personalInfoDto.setIdproof(personalInfoDbObject.getIdProof());
			personalInfoDto.setIdprooftype(personalInfoDbObject.getIdProoftype());
			
			personalInfoDto.setShares(personalInfoDbObject.getShares());
			personalInfoDto.setLoanlimit(personalInfoDbObject.getLoanlimit());

			personalInfoDto.setBussinessexemption(personalInfoDbObject.isBussinessExemption());
			personalInfoDto.setIntroname(personalInfoDbObject.getIntroname());

			personalInfoDto.setOldid(personalInfoDbObject.getOldId());
			personalInfoDto.setCategory(personalInfoDbObject.getCategory());
			personalInfoDto.setDisable(personalInfoDbObject.isDisable());

			return personalInfoDto;
		
		} else {

			return null;

		}

	}

	public List<PersonalInfoAutoCompletePojo> autocomplete(String keyword) {
		List<PersonalInfo> allPersonalInfoList = personalInfoRepository.personalInfoAutoComplete(false, keyword,
				Arrays.asList("CUSTOMER", "PARTNER"));

		List<PersonalInfoAutoCompletePojo> toBeReturnedDtoList = new ArrayList<PersonalInfoAutoCompletePojo>();

		allPersonalInfoList.stream().forEach(p -> {

			PersonalInfoAutoCompletePojo personalInfoAutoCompletePojo = new PersonalInfoAutoCompletePojo();
			personalInfoAutoCompletePojo.setId(p.getPersonalInfoId());

			personalInfoAutoCompletePojo.setFirstname(p.getFirstName());
			personalInfoAutoCompletePojo.setLastname(p.getLastName());
			personalInfoAutoCompletePojo.setGender(p.getGender());
			personalInfoAutoCompletePojo.setMobile(p.getMobile());
			
			toBeReturnedDtoList.add(personalInfoAutoCompletePojo);

		});

		return toBeReturnedDtoList;
	}

	public List<PersonalInfoAutoCompletePojo> personInfoAutoCompleteByCodeAndMasterCode(String keyword,
			String masterCode, String code) {

		String personTypes = accountMasterRepo.findPersonTypeByMasterCodeAndCode(masterCode, code);
		
		List<String> personTypesList = new ArrayList<String>();

		if (personTypes != null) {
			personTypesList = Arrays.asList(personTypes.split(","));
		}

		List<PersonalInfo> allPersonalInfoList = personalInfoRepository.personalInfoAutoComplete(false, keyword,
				personTypesList);

		List<PersonalInfoAutoCompletePojo> toBeReturnedDtoList = new ArrayList<PersonalInfoAutoCompletePojo>();

		allPersonalInfoList.stream().forEach(p -> {

			PersonalInfoAutoCompletePojo personalInfoAutoCompletePojo = new PersonalInfoAutoCompletePojo();
			personalInfoAutoCompletePojo.setId(p.getPersonalInfoId());

			personalInfoAutoCompletePojo.setFirstname(p.getFirstName());
			personalInfoAutoCompletePojo.setLastname(p.getLastName());
			personalInfoAutoCompletePojo.setGender(p.getGender());

			toBeReturnedDtoList.add(personalInfoAutoCompletePojo);

		});

		return toBeReturnedDtoList;
	}

	
	public List<PersonalInfoAutoCompletePojo> personInfoAutoCompleteByCategory(String keyword, String category) {
		
		List<String> personTypesList = new ArrayList<String>();
		personTypesList.add(category);

		List<PersonalInfo> allPersonalInfoList = personalInfoRepository.personalInfoAutoComplete(false, keyword,
				personTypesList);

		List<PersonalInfoAutoCompletePojo> toBeReturnedDtoList = new ArrayList<PersonalInfoAutoCompletePojo>();

		allPersonalInfoList.stream().forEach(p -> {

			PersonalInfoAutoCompletePojo personalInfoAutoCompletePojo = new PersonalInfoAutoCompletePojo();
			personalInfoAutoCompletePojo.setId(p.getPersonalInfoId());

			personalInfoAutoCompletePojo.setFirstname(p.getFirstName());
			personalInfoAutoCompletePojo.setLastname(p.getLastName());
			personalInfoAutoCompletePojo.setGender(p.getGender());

			toBeReturnedDtoList.add(personalInfoAutoCompletePojo);

		});

		return toBeReturnedDtoList;
	}

}
