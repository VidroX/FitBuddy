package com.example.FitBuddy.Authentication;

import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.Registration;
import com.example.FitBuddy.Repositories.AuthenticationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthenticationService {

    private final AuthenticationRepository repository;

    @Autowired
    public AuthenticationService(AuthenticationRepository repository) {
        this.repository = repository;
    }

    public void addNewUser(Registration userRegistrationDetails) {
        repository.save(userRegistrationDetails);
    }

}
