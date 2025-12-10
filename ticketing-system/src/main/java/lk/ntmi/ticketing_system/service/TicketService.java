package lk.ntmi.ticketing_system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lk.ntmi.ticketing_system.model.Ticket;
import lk.ntmi.ticketing_system.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        ticket.setId(UUID.randomUUID().toString().substring(0, 8));
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setStatus("PENDING");
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByBranch(String branchName) {
        return ticketRepository.findByBranchName(branchName);
    }

    
    
    
    // --- THIS IS THE IMPORTANT UPDATE ---
    public Ticket updateTicketStatus(String id, String newStatus, String username) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            
            // --- SECURITY CHECK: JOB LOCKING ---
            // If trying to COMPLETE, check if the user is the one who STARTED it.
            if ("COMPLETED".equals(newStatus)) {
                if (ticket.getFixedBy() != null && !ticket.getFixedBy().equals(username)) {
                    throw new RuntimeException("Access Denied: Only " + ticket.getFixedBy() + " can complete this job.");
                }
                ticket.setEndTime(LocalDateTime.now());
            }

            // --- START JOB LOGIC ---
            if ("IN_PROGRESS".equals(newStatus)) {
                // If someone else already started it, don't let a second person overwrite it
                if (ticket.getFixedBy() != null && !ticket.getFixedBy().equals(username)) {
                     throw new RuntimeException("Job already started by " + ticket.getFixedBy());
                }
                ticket.setStartTime(LocalDateTime.now());
                ticket.setFixedBy(username);
            } 
            
            ticket.setStatus(newStatus);
            return ticketRepository.save(ticket);
        }
        return null;
    }
}