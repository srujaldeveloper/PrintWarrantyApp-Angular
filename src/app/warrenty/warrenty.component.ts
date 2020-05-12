import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-warrenty',
  templateUrl: './warrenty.component.html',
  styleUrls: ['./warrenty.component.scss']
})


export class WarrentyComponent implements OnInit {
  isSearch: boolean = true;
  cardDetails: any;
  cardNumber = "";
  code = "ANAGRAFICA";
  Parameter: any;
  Languages: SelectItem[];
  selectedLanguage: any;
  date: any;
  constructor(private router: Router, private translate: TranslateService) {

    this.Languages = [
      { label: 'Italian (It)', value: 'it' },
      { label: 'English (en)', value: 'en' }
    ];


  }

  ngOnInit() {


    this.cardNumber = ''
    let language = localStorage.getItem('language');

    if (language == null || language == '' || language == undefined) {
      this.translate.setDefaultLang('it');
      this.selectedLanguage = { label: 'Italian (It)', value: 'it' };
    }
    else {
      this.translate.setDefaultLang(language);
      if (language == 'it') {
        this.selectedLanguage = { label: 'Italian (It)', value: 'it' };
      } else if (language == 'en') {
        this.selectedLanguage = { label: 'English (en)', value: 'en' };
      }

    }

    this.date = new Date();

  }






  onSearch() {
    if (this.cardNumber != '' && this.cardNumber != undefined) {
      this.Parameter = 'GARANZIA|' + this.cardNumber;
      //this.cardNumber = '';
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', 'http://test.systech.cloud/AurumWS/AurumServiceISAPI.dll/soap/IWSAurumIntf', true);
      const input_element = <HTMLInputElement>document.getElementById('choosenNumber');


      const sr =
        `<x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:urn="urn:WSAurumIntf-IWSAurumIntf">
    <x:Header/>
    <x:Body>
        <urn:Esegui>
            <urn:Funzione>`+ this.code + `</urn:Funzione>
            <urn:Dati>`+ this.Parameter + `</urn:Dati>
        </urn:Esegui>
    </x:Body>
</x:Envelope>`;

      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {

            const xml = xmlhttp.responseXML;
            // Here I'm getting the value contained by the <return> node.
            this.cardDetails = JSON.parse(xml.getElementsByTagName('return')[0].innerHTML);

            if (this.cardDetails[0].CODE == "0") {
              this.isSearch = false;
            }
            else {
              alert(this.cardDetails[0].MESSAGE);
            }
          }
        }
      }
      // Send the POST request.
      //xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      //xmlhttp.setRequestHeader('SOAPAction', 'urn:WSAurumIntf-IWSAurumIntf#Esegui');
      xmlhttp.responseType = 'document';
      xmlhttp.send(sr);

    }
  }

  onSearchBack() {
    this.cardNumber = '';
    this.isSearch = true;
  }

  changeLanguage(filterVal: any) {

    this.translate.use(filterVal);
    localStorage.setItem('language', filterVal);
  }

}
