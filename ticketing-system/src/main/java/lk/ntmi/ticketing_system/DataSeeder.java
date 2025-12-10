package lk.ntmi.ticketing_system;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList; // Import ArrayList

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lk.ntmi.ticketing_system.model.AppSettings;
import lk.ntmi.ticketing_system.model.Ticket;
import lk.ntmi.ticketing_system.model.User;
import lk.ntmi.ticketing_system.repository.AppSettingsRepository;
import lk.ntmi.ticketing_system.repository.TicketRepository;
import lk.ntmi.ticketing_system.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AppSettingsRepository settingsRepository;

    public DataSeeder(TicketRepository ticketRepository, UserRepository userRepository, AppSettingsRepository settingsRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.settingsRepository = settingsRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // --- SEED TICKETS ---
        if (ticketRepository.count() == 0) {
            Ticket t1 = new Ticket();
            t1.setId("T-1001");
            t1.setBranchName("Gampaha");
            t1.setErrorCategory("Hardware");
            t1.setErrorType("Printer Jam");
            t1.setDescription("Printer is not pulling paper.");
            t1.setStatus("PENDING");
            t1.setCreatedDate(LocalDateTime.now());
            
            Ticket t2 = new Ticket();
            t2.setId("T-1002");
            t2.setBranchName("Kandy");
            t2.setErrorCategory("Network");
            t2.setErrorType("No Internet");
            t2.setDescription("Cannot connect to VPN.");
            t2.setStatus("COMPLETED");
            t2.setCreatedDate(LocalDateTime.now().minusDays(1));
            
            ticketRepository.save(t1);
            ticketRepository.save(t2);
            System.out.println("✅ Dummy Tickets Added!");
        }

        // --- SEED USERS ---
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRole("OPS");
            userRepository.save(admin);

            User branch = new User();
            branch.setUsername("gampaha_user");
            branch.setPassword("1234");
            branch.setRole("BRANCH");
            branch.setBranchName("Gampaha");
            userRepository.save(branch);

            System.out.println("✅ Admin & Branch Users Created!");
        }

        // --- SEED ADVANCED SETTINGS (Updated Part) ---
        // We delete old settings first to prevent data conflicts with the new structure
        settingsRepository.deleteAll(); 
        
        if (settingsRepository.count() == 0) {
            AppSettings settings = new AppSettings();
            settings.setId("CONFIG_001");
            
            // 1. Add Branches
            settings.setBranches(List.of("Gampaha", "Kandy", "Galle", "Nugegoda", "Jaffna"));
            
            // 2. Add Categories
            settings.setErrorCategories(List.of("Hardware", "Network", "Software"));
            
            // 3. Add Error Types (Now linked to Categories)
            List<AppSettings.ErrorType> types = new ArrayList<>();
            types.add(new AppSettings.ErrorType("Printer Jam", "Hardware"));
            types.add(new AppSettings.ErrorType("Mouse Broken", "Hardware"));
            types.add(new AppSettings.ErrorType("No Internet", "Network"));
            types.add(new AppSettings.ErrorType("VPN Error", "Network"));
            types.add(new AppSettings.ErrorType("Login Failed", "Software"));
            types.add(new AppSettings.ErrorType("System Crash", "Software"));
            
            settings.setErrorTypes(types);
            
            settingsRepository.save(settings);
            System.out.println("✅ Advanced Dropdown Settings Created!");
        }
    }
}