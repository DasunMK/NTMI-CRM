package lk.ntmi.ticketing_system.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.ntmi.ticketing_system.model.User;
import lk.ntmi.ticketing_system.repository.UserRepository;

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

    // 6. Simple Identity Verification Reset
    @PutMapping("/reset-password")
    public void resetPassword(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email"); 
        String phone = payload.get("phone"); 
        String newPassword = payload.get("newPassword");
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        // SECURITY CHECK: Do the details match?
        if (user.getEmail() == null || !user.getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Verification Failed: Email does not match our records.");
        }
        if (user.getPhone() == null || !user.getPhone().equals(phone)) {
            throw new RuntimeException("Verification Failed: Phone number does not match our records.");
        }

        // If matched, allow reset
        user.setPassword(newPassword); 
        userRepository.save(user);
    }
}