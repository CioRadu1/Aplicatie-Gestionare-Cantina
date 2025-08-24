package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.Reteta;
import main.Aplicatie.Gestionare.Stocuri.repository.RetetaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RetetaService {

    private final RetetaRepository retetaRepository;

    public RetetaService(RetetaRepository retetaRepository) {
        this.retetaRepository = retetaRepository;
    }

    public List<Reteta> findAllRetete() {
        return retetaRepository.findAll();
    }

    public Optional<Reteta> findById(String codArticol) {
        return retetaRepository.findById(codArticol);
    }

    public Reteta saveReteta(Reteta reteta) {
        return retetaRepository.save(reteta);
    }

    public void deleteReteta(String codArticol) {
        retetaRepository.deleteById(codArticol);
    }

    public List<Reteta> findByNumeReteta(String numeReteta) {
        return retetaRepository.findByDenumireContainingIgnoreCase(numeReteta);
    }
}