package com.example.FitBuddy.Authentication;


import com.example.FitBuddy.Entity.Registration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "fitbuddy/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;

    @PostMapping(path = "/register")
    public void registerNewUser(@RequestBody Registration userRegistrationDetails)
    {
        service.addNewUser(userRegistrationDetails);
    }
}
