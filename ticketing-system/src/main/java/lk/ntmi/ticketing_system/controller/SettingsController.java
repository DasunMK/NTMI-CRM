package lk.ntmi.ticketing_system.controller;

import lk.ntmi.ticketing_system.model.AppSettings;
import lk.ntmi.ticketing_system.repository.AppSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//import java.util.ArrayList;
import java.util.Map;
//import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private AppSettingsRepository repository;

    private AppSettings getSettings() {
        return repository.findById("CONFIG_001").orElseGet(() -> {
            AppSettings s = new AppSettings();
            s.setId("CONFIG_001");
            return repository.save(s);
        });
    }

    @GetMapping
    public AppSettings get() { return getSettings(); }

    // ================= BRANCHES =================
    @PostMapping("/branch")
    public AppSettings addBranch(@RequestBody Map<String, String> body) {
        AppSettings s = getSettings();
        if (!s.getBranches().contains(body.get("value"))) {
            s.getBranches().add(body.get("value"));
        }
        return repository.save(s);
    }

    @DeleteMapping("/branch/{name}")
    public AppSettings deleteBranch(@PathVariable String name) {
        AppSettings s = getSettings();
        s.getBranches().remove(name);
        return repository.save(s);
    }

    // ================= CATEGORIES =================
    @PostMapping("/category")
    public AppSettings addCategory(@RequestBody Map<String, String> body) {
        AppSettings s = getSettings();
        if (!s.getErrorCategories().contains(body.get("value"))) {
            s.getErrorCategories().add(body.get("value"));
        }
        return repository.save(s);
    }

    @DeleteMapping("/category/{name}")
    public AppSettings deleteCategory(@PathVariable String name) {
        AppSettings s = getSettings();
        s.getErrorCategories().remove(name);
        // Optional: Also remove types belonging to this category?
        // For now, we keep them to avoid accidental data loss logic complexity.
        return repository.save(s);
    }

    // ================= ERROR TYPES (Linked) =================
    @PostMapping("/type")
    public AppSettings addType(@RequestBody AppSettings.ErrorType type) {
        AppSettings s = getSettings();
        // Remove if exists to allow "Edit" via overwrite
        s.getErrorTypes().removeIf(t -> t.getName().equals(type.getName()));
        s.getErrorTypes().add(type);
        return repository.save(s);
    }

    @DeleteMapping("/type/{name}")
    public AppSettings deleteType(@PathVariable String name) {
        AppSettings s = getSettings();
        s.getErrorTypes().removeIf(t -> t.getName().equals(name));
        return repository.save(s);
    }
}