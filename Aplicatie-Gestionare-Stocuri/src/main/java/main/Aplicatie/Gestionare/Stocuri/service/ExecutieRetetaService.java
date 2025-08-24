package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.ExecutieReteta;
import main.Aplicatie.Gestionare.Stocuri.repository.ExecutieRetetaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ExecutieRetetaService {

    private final ExecutieRetetaRepository executieRetetaRepository;

    public ExecutieRetetaService(ExecutieRetetaRepository executieRetetaRepository) {
        this.executieRetetaRepository = executieRetetaRepository;
    }

    public List<ExecutieReteta> findAllExecutii() {
        return executieRetetaRepository.findAll();
    }

    public Optional<ExecutieReteta> findById(String codArticol) {
        return executieRetetaRepository.findById(codArticol);
    }

    public ExecutieReteta saveExecutieReteta(ExecutieReteta executieReteta) {
        return executieRetetaRepository.save(executieReteta);
    }

    public void deleteExecutieReteta(String codArticol) {
        executieRetetaRepository.deleteById(codArticol);
    }

    public List<ExecutieReteta> findByNumeReteta(String numeReteta) {
        return executieRetetaRepository.findByNumeRetetaContainingIgnoreCase(numeReteta);
    }
    public Optional<ExecutieReteta> updatePortii(String codArticol, int totalPortiiNoi) {
        Optional<ExecutieReteta> optionalExecutie = executieRetetaRepository.findById(codArticol);
        if (optionalExecutie.isPresent()) {
            ExecutieReteta executie = optionalExecutie.get();
            executie.setTotalPortii(totalPortiiNoi);
            return Optional.of(executieRetetaRepository.save(executie));
        } else {
            return Optional.empty();
        }
    }
}