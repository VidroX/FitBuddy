package com.example.FitBuddy.Authentication;

import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.User;
import com.example.FitBuddy.Repositories.ActivitiesRepository;
import com.example.FitBuddy.Repositories.AuthenticationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private AuthenticationRepository authenticationRepository;

    @Autowired
    private ActivitiesRepository activityRepository;

    public void addNewUser(User userRegistrationDetails) {

        authenticationRepository.save(userRegistrationDetails);
    }

    public Activities getActivityList(String name){
        return activityRepository.findByName(name);
    }

    public boolean getUserCredential(String encodedPassword) {
        return authenticationRepository.existsByPassword(encodedPassword);
    }

    public String getTest(String encodedPassword)
    {
        return authenticationRepository.findByPassword(encodedPassword);
    }
}
