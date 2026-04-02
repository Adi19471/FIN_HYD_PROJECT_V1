package com.balaji.finance.util;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.balaji.finance.repo.PersonSequenceRepository;

@Service
public class PersonalSequenceService {

	private final PersonSequenceRepository repository;

	public PersonalSequenceService(PersonSequenceRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public Long getNextSequence(String type) {
		repository.increment(type);
		return repository.getLastInsertedId();
	}

}
