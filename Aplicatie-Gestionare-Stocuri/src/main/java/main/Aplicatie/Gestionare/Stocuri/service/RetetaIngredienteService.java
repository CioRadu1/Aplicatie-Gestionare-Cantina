package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.RetetaIngrediente;
import main.Aplicatie.Gestionare.Stocuri.model.RetetaIngredienteKey;
import main.Aplicatie.Gestionare.Stocuri.repository.RetetaIngredienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RetetaIngredienteService {

    private final RetetaIngredienteRepository retetaIngredienteRepository;

    public RetetaIngredienteService(RetetaIngredienteRepository retetaIngredienteRepository) {
        this.retetaIngredienteRepository = retetaIngredienteRepository;
    }

    public List<RetetaIngrediente> findAllRetetaIngrediente() {
        return retetaIngredienteRepository.findAll();
    }

    public Optional<RetetaIngrediente> findById(RetetaIngredienteKey id) {
        return retetaIngredienteRepository.findById(id);
    }

    public RetetaIngrediente saveRetetaIngrediente(RetetaIngrediente retetaIngrediente) {
        return retetaIngredienteRepository.save(retetaIngrediente);
    }

    public void deleteRetetaIngrediente(RetetaIngredienteKey id) {
        retetaIngredienteRepository.deleteById(id);
    }
    public List<RetetaIngrediente> findByCodReteta(String codReteta) {
        return retetaIngredienteRepository.findByIdCodReteta(codReteta);
    }
}