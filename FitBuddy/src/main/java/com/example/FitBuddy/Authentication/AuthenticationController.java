package com.example.FitBuddy.Authentication;


import com.example.FitBuddy.Entity.User;
import org.apache.juli.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping(path = "fitbuddy/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;

    @PostMapping(path = "/register")
    public void registerNewUser(@RequestBody User userRegistrationDetails)
    {
        service.addNewUser(userRegistrationDetails);
    }
}
