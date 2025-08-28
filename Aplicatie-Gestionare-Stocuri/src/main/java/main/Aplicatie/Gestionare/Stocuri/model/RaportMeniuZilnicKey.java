package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Data
public class RaportMeniuZilnicKey implements Serializable {
    @Column(name = "Cod articol")
    private String codArticol;
    @Column(name = "data_de_producere")
    private LocalDate dataDeProducere;
}