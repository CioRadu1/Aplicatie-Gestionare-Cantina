package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.MateriePrima;
import main.Aplicatie.Gestionare.Stocuri.repository.MateriePrimaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MateriePrimaService {

    private final MateriePrimaRepository materiePrimaRepository;

    public MateriePrimaService(MateriePrimaRepository materiePrimaRepository) {
        this.materiePrimaRepository = materiePrimaRepository;
    }

    public List<MateriePrima> findAllMateriiPrime() {
        return materiePrimaRepository.findAll();
    }

    public Optional<MateriePrima> findById(String codArticol) {
        return materiePrimaRepository.findById(codArticol);
    }

    public List<MateriePrima> findByDenumire(String denumire) {
        return materiePrimaRepository.findByDenumireContainingIgnoreCase(denumire);
    }

    public List<MateriePrima> findByGestiune(String gestiune) {
        return materiePrimaRepository.findByGestiune(gestiune);
    }
    public MateriePrima saveMateriePrima(MateriePrima materiePrima) {
        return materiePrimaRepository.save(materiePrima);
    }

    public void deleteMateriePrima(String codArticol) {
        materiePrimaRepository.deleteById(codArticol);
    }
}