package com.example.FitBuddy.Entity;

import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Document("User")
public class User {

    @Id
    private String Id;

    private boolean subscription ;


    private String firstName, lastName, email, bio, photo, searchAddress, password;
    private Date lastLogin;
    private Gender gender;
    private String[] matchesList, pendingMatches;
    private ArrayList<Activities> activities;

    private UserType userType;


    public User(String id, boolean subscription, String firstName, String lastName, String email, String bio, String photo, String searchAddress, String password, Date lastLogin, Gender gender, String[] matchesList, String[] pendingMatches, ArrayList<Activities> activities, UserType userType) {
        Id = id;
        this.subscription = subscription;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.bio = bio;
        this.photo = photo;
        this.searchAddress = searchAddress;
        this.password = password;
        this.lastLogin = lastLogin;
        this.gender = gender;
        this.matchesList = matchesList;
        this.pendingMatches = pendingMatches;
        this.activities = activities;
        this.userType = userType;
    }

    public User() {

    }



       public String getId() {
        return Id;
    }

    public void setId(String Id) {
        this.Id = Id;
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

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
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
    public ArrayList<Activities> getActivities() {
        return activities;
    }

    public void setActivities(ArrayList<Activities> activities) {
        this.activities = activities;
    }

    public boolean isSubscription() {
        return subscription;
    }

    public void setSubscription(boolean subscription) {
        this.subscription = subscription;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }


}

enum Gender{
   Male,
   Female
}
