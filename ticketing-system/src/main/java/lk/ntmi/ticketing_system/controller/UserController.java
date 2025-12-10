package lk.ntmi.ticketing_system.controller;

import lk.ntmi.ticketing_system.model.User;
import lk.ntmi.ticketing_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Login
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        throw new RuntimeException("Invalid Credentials");
    }

    // Create
    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        user.setId(null); // <--- FORCE NEW ID (This fixes the issue)
        return userRepository.save(user);
    }
    // Read All
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update (NEW)
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole());
        user.setBranchName(userDetails.getBranchName());
        return userRepository.save(user);
    }

    // Delete (NEW)
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }
}