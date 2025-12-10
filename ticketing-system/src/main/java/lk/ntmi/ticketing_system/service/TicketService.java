package lk.ntmi.ticketing_system.service;

import lk.ntmi.ticketing_system.model.Ticket;
import lk.ntmi.ticketing_system.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
            ticket.setStatus(newStatus);

            // 1. Start Job Logic
            if ("IN_PROGRESS".equals(newStatus)) {
                ticket.setStartTime(LocalDateTime.now());
                ticket.setFixedBy(username); // Save the Admin's Name
            } 
            // 2. Complete Job Logic
            else if ("COMPLETED".equals(newStatus)) {
                ticket.setEndTime(LocalDateTime.now());
            }
            
            return ticketRepository.save(ticket);
        }
        return null;
    }
}