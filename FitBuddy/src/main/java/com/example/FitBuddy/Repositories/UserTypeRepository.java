package com.example.FitBuddy.Repositories;

import com.example.FitBuddy.Entity.UserType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserTypeRepository extends MongoRepository<UserType, String> {
    UserType findByName(String name);
}
