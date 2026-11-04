package com.balaji.finance.util;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.balaji.finance.entity.PersonalInfo;

/**
 * How a customer, partner or guarantor is named on every screen and report:
 * "First Last". A missing part is left out, so a person without a last name
 * reads "First", never "First null".
 */
public final class PersonNames {

	private PersonNames() {
	}

	public static String fullName(String firstName, String lastName) {
		return Stream.of(firstName, lastName).filter(Objects::nonNull).map(String::trim).filter(s -> !s.isEmpty())
				.collect(Collectors.joining(" "));
	}

	/** The person's full name, or "" when there is no person. */
	public static String fullName(PersonalInfo person) {
		return person == null ? "" : fullName(person.getFirstName(), person.getLastName());
	}
}
