package com.example.FitBuddy.Repositories;

import com.example.FitBuddy.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuthenticationRepository extends MongoRepository<User, String> {

}
