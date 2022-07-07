package com.example.FitBuddy.Authentication;

import com.example.FitBuddy.Entity.User;
import com.example.FitBuddy.Repositories.AuthenticationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private AuthenticationRepository repository;

    public void addNewUser(User userRegistrationDetails) {
        repository.save(userRegistrationDetails);
    }

}
