Komendy
=========

<prefix> - znak lub ciąg znaków ustawiony do wywołania bota na serwerze ( domyślny - 'b' - zawsze aktywny )


Komendy administracyjne
-----------------------

Import
~~~~~~~~~~~~~~~~~~~~~~~

Opis: Manualnie wywołuje import i zapis danych do pazy danych.


.. code-block:: console

    Użycie: <prefix>import

.. warning::
    Nie będzie możlowe kożystanie z komend podczas importu.

.. note::
    Wymagany pozwolenie/dostęp właściciela



Reload
~~~~~~~~~~~~~~~~~~~~~~~

Opis: Przeładowuje bota bez potrzeby jego restartowania


.. code-block:: console

    Użycie: <prefix>reload

.. note::
    Wymagany pozwolenie/dostęp właściciela

Clear
~~~~~~~~~~~~~~~~~~~~~~~

Opis: Czyści podaną ilośc wiadomości


.. code-block:: console

    Użycie: <prefix>clear <numer_wiadomości>

.. note::
    Wymagane uprawnienia MANAGE_MESSAGES lub ADMINISTRATOR

Prefix
~~~~~~~~~~~~~~~~~~~~~~~

Opis: Ustawia prefix bota na serwerze

.. note::
    Bot będzie mógł odpowiadać przez dwa prefix, serwerowy oraz ogólny

.. code-block:: console

    Użycie: <prefix>Prefix <nowy_prefix>

.. note::
    Wymagane uprawnienia MANAGE_MESSAGES lub ADMINISTRATOR


Komendy ogólne
-----------------------

Plan
~~~~~~~~~~~~~~~~~~~~~~~

Przyjmuję 1 argument

Wyświetla plan dla podanej klasy

Nauczyciel
~~~~~~~~~~~~~~~~~~~~~~~

Przyjmuje 1 argument

Wyświetla plan dla pdanego nauczyciela


sale
~~~~~~~~~~~~~~~~~~~~~~~

Nie przyjmuje argumentów

Wyświetla spis wszystkich mozliwych gabinetów do zajęć

nauczyciele
~~~~~~~~~~~~~~~~~~~~~~~

Nie przyjmuje argumentów

Wyświetla listę wszystkich nauczycieli