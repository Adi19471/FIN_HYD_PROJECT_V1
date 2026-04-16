package com.balaji.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@SpringBootApplication
public class SriBalajiFinanceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SriBalajiFinanceApplication.class, args);
	}

}
