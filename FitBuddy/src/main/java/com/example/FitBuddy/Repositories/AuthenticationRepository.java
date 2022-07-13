package com.example.FitBuddy.Repositories;

import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AuthenticationRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

}
