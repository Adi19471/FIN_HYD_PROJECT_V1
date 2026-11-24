package com.balaji.finance.entity;


import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = "name") })
public class Users {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotBlank
	@Column(nullable = false, unique = true, length = 100)
	private String name;

	@NotBlank
	@Column(nullable = false)
	private String password;

	private String role;

	// The branches this user may work in (Branch.code), one at a time. With
	// more than one, the user picks a branch after signing in.
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_branch", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "branch_code", length = 30)
	private Set<String> branchCodes = new LinkedHashSet<>();


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}


	public Set<String> getBranchCodes() {
		return branchCodes;
	}

	public void setBranchCodes(Set<String> branchCodes) {
		this.branchCodes = branchCodes == null ? new LinkedHashSet<>() : branchCodes;
	}
}
