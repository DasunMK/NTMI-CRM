package lk.ntmi.ticketing_system.controller;

import java.util.List;
import java.util.Map; // Important Import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lk.ntmi.ticketing_system.model.Ticket;
import lk.ntmi.ticketing_system.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/create")
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping("/all")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/branch/{branchName}")
    public List<Ticket> getTicketsByBranch(@PathVariable String branchName) {
        return ticketService.getTicketsByBranch(branchName);
    }

    
    @PutMapping("/update/{id}")
    public Ticket updateTicketState(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        String username = request.get("username"); 
        
        // Pass to service
        return ticketService.updateTicketStatus(id, newStatus, username);
    }
}