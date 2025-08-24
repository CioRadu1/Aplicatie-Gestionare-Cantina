package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.util.Date;
import java.math.BigDecimal;

@Entity
@Table(name = "retete")
@Data
public class Reteta {
    @Id
    @Column(name = "Cod Articol")
    private String codArticol;
    @Column(name = "Cod moneda")
    private String codMoneda;
    @Column(name = "Cont stoc")
    private String contStoc;
    private String denumire;
    @Column(name = "Denumire scurta")
    private String denumireScurta;
    @Column(name = "Denumire UM")
    private String denumireUm;
    private Float gestiune;
    private String gestiune1;
    @Column(name = "TVA vanzare")
    private String tvaVanzare;
    @Column(name = "TVA vanzare1")
    private String tvaVanzare1;
    private String um;
}