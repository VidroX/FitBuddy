package com.example.FitBuddy.Authentication;

import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.User;
import com.example.FitBuddy.Entity.UserType;
import com.example.FitBuddy.Repositories.ActivitiesRepository;
import com.example.FitBuddy.Repositories.AuthenticationRepository;
import com.example.FitBuddy.Repositories.UserTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    private AuthenticationRepository authenticationRepository;
    @Autowired
    private ActivitiesRepository activityRepository;
    @Autowired
    private UserTypeRepository userTypeRepository;
    private final PasswordEncoder passwordEncoder = new Argon2PasswordEncoder();



    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = authenticationRepository.findByEmail(email);
        if(user == null){
            //log.error("User not found")
            throw new UsernameNotFoundException("User not found");
        }

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        UserType userType = user.getUserType();
        authorities.add(new SimpleGrantedAuthority(userType.getName()));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }



    public void addNewUser(User userRegistrationDetails) {
        userRegistrationDetails.setPassword(passwordEncoder.encode(userRegistrationDetails.getPassword()));
        authenticationRepository.save(userRegistrationDetails);
    }

    public Activities getActivityList(String name){
        return activityRepository.findByName(name);
    }

    public User getUserCredential(String email) {
        return authenticationRepository.findByEmail(email);
    }

    public UserType getUserType(String name){
        return userTypeRepository.findByName(name);
    }


}
