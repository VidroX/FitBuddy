package com.example.FitBuddy.Authentication;


import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.Registration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "fitbuddy/auth")
public class AuthenticationController {


    private final AuthenticationService service;

    @Autowired
    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping(path = "/register")
    public void registerNewUser(@RequestBody Registration userRegistrationDetails)
    {
        service.addNewUser(userRegistrationDetails);
    }
}
