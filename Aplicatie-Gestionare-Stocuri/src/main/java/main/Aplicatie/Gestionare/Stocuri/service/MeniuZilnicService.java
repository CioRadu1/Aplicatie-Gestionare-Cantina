package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.MeniuZilnic;
import main.Aplicatie.Gestionare.Stocuri.repository.MeniuZilnicRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MeniuZilnicService {

    private final MeniuZilnicRepository meniuZilnicRepository;

    public MeniuZilnicService(MeniuZilnicRepository meniuZilnicRepository) {
        this.meniuZilnicRepository = meniuZilnicRepository;
    }

    public MeniuZilnic selecteazaRetetaPentruMeniu(MeniuZilnic meniuZilnic) {
        return meniuZilnicRepository.save(meniuZilnic);
    }

    public void deleteMeniuZilnic(String codArticol) {
        meniuZilnicRepository.deleteById(codArticol);
    }

    public List<MeniuZilnic> findAllMeniuZilnic() {
        return meniuZilnicRepository.findAll();
    }

    public List<MeniuZilnic> findByNumeReteta(String numeReteta) {
        return meniuZilnicRepository.findByNumeRetetaContainingIgnoreCase(numeReteta);
    }

    public Optional<MeniuZilnic> findById(String codArticol) {
        return meniuZilnicRepository.findById(codArticol);
    }
}