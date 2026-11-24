package com.balaji.finance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A branch of the company. All branches are equal - there is no main or sub
 * branch. `code` is the key stamped on users and on every record made in the
 * branch (customers, loans, cash book), so it never changes once in use; the
 * name and location are free to edit.
 */
@Entity
@Table(name = "BRANCH")
public class Branch {

	/**
	 * The branch that records from before branches existed were moved to. It
	 * is an ordinary branch; this is only the code the one-time move used.
	 */
	public static final String DEFAULT_CODE = "AMEERPET";

	@Id
	@Column(length = 30)
	private String code;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(length = 150)
	private String location;

	private boolean active = true;

	// Order in branch lists.
	private Integer sortOrder;

	public Branch() {
	}

	public Branch(String code, String name, String location, Integer sortOrder) {
		this.code = code;
		this.name = name;
		this.location = location;
		this.sortOrder = sortOrder;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}
}
