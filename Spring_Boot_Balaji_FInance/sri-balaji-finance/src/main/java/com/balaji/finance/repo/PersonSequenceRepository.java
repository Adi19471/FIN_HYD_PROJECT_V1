package com.balaji.finance.repo;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.balaji.finance.entity.PersonSequenceTable;

@Repository
public interface PersonSequenceRepository extends JpaRepository<PersonSequenceTable, String> {

	@Modifying
	@Query(value = """
			UPDATE person_sequence_table
			SET last_number = LAST_INSERT_ID(last_number + 1)
			WHERE name = :name
			""", nativeQuery = true)
	void increment(@Param("name") String name);

	@Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
	Long getLastInsertedId();
}