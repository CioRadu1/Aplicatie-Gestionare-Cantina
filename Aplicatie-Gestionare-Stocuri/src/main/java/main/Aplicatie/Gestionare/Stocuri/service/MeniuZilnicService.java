package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.ExecutieReteta;
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

    public Optional<MeniuZilnic> updatePortii(String codArticol, int totalPortiiNoi) {
        Optional<MeniuZilnic> optionalMeniuZilnic = meniuZilnicRepository.findById(codArticol);
        if (optionalMeniuZilnic.isPresent()) {
            MeniuZilnic meniuZilnic = optionalMeniuZilnic.get();
            meniuZilnic.setTotalPortii(totalPortiiNoi);
            return Optional.of(meniuZilnicRepository.save(meniuZilnic));
        } else {
            return Optional.empty();
        }
    }

    public void deleteMeniuZilnic(String codArticol) {
        meniuZilnicRepository.deleteById(codArticol);
    }
    public void deleteAllMeniuZilnic() {
        meniuZilnicRepository.deleteAll();
    }
    public void finalizeDay() {
        meniuZilnicRepository.finalizeDay();
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