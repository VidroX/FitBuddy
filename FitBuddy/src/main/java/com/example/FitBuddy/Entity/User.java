package com.example.FitBuddy.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Calendar;

@Document("User")
public class User {
    private String id, firstName, lastName, email, phoneNumber, bio, photo, searchAddress, password;
    private Calendar lastLogin;
    private Gender gender;
    private String[] matchesList, pendingMatches;

    public User() {

    }

    public User(String firstName, String lastName, String email, String phoneNumber, String bio, String photo, String searchAddress, Calendar lastLogin, Gender gender, String[] matchesList, String[] pendingMatches) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
        this.photo = photo;
        this.searchAddress = searchAddress;
        this.lastLogin = lastLogin;
        this.gender = gender;
        this.matchesList = matchesList;
        this.pendingMatches = pendingMatches;
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getSearchAddress() {
        return searchAddress;
    }

    public void setSearchAddress(String searchAddress) {
        this.searchAddress = searchAddress;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Calendar getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Calendar lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String[] getMatchesList() {
        return matchesList;
    }

    public void setMatchesList(String[] matchesList) {
        this.matchesList = matchesList;
    }

    public String[] getPendingMatches() {
        return pendingMatches;
    }

    public void setPendingMatches(String[] pendingMatches) {
        this.pendingMatches = pendingMatches;
    }
}

enum Gender{
   Male,
   Female
}
