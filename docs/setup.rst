Ustawienia Bota
=================

Zmienne środowiskowe
---------------------

Przed uruchomieniem bota należy podać 2 zmienne środowiskowe

TOKEN - Token logowania bota discord 

MONGO_TOKEN - link logowania się do bazy danych

.. note::

  Zmienne te można zadeklarować w systemie lub utworzyć plik .env


Zawartość pliku .env

.. code-block:: console

    TOKEN = YOUR_TOKEN_HERE
    MONGO_TOKEN = YOUR_CONNECTION_LINK_HERE


Instalacja modułów
-------------------

Przed wystartowaniem bota należy zainstalować wszystkie moduły podaje w package.json

Można automatycznie zainstalować brakujące moduły podaną komendą

.. code-block:: console

    npm ci

Lub zainstalować każdy z osobna poprzez komendę

.. code-block:: console

    npm i <nazwa_modułu>