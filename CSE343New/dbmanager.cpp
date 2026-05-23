#include "dbmanager.h"
#include <QDebug>

DBManager::DBManager(const QString& path) {
    m_db = QSqlDatabase::addDatabase("QSQLITE");
    m_db.setDatabaseName(path);

    if (!m_db.open()) {
        qDebug() << "Error: connection with database failed: " << m_db.lastError();
    } else {
        QSqlQuery query;
        query.exec("CREATE TABLE IF NOT EXISTS students (roll INTEGER PRIMARY KEY, name TEXT, balance REAL)");
        query.exec("CREATE TABLE IF NOT EXISTS books (isbn INTEGER PRIMARY KEY, title TEXT, author TEXT, available INTEGER)");
    }
}

DBManager::~DBManager() {
    if (m_db.isOpen())
        m_db.close();
}

bool DBManager::isOpen() const { return m_db.isOpen(); }

bool DBManager::addStudent(int roll, const QString& name, double balance) {
    QSqlQuery query;
    query.prepare("INSERT INTO students (roll, name, balance) VALUES (:r, :n, :b)");
    query.bindValue(":r", roll);
    query.bindValue(":n", name);
    query.bindValue(":b", balance);
    return query.exec();
}

bool DBManager::updateStudentBalance(int roll, double newBalance) {
    QSqlQuery query;
    query.prepare("UPDATE students SET balance=:b WHERE roll=:r");
    query.bindValue(":r", roll);
    query.bindValue(":b", newBalance);
    return query.exec();
}

bool DBManager::getStudent(int roll, QString& name, double& balance) {
    QSqlQuery query;
    query.prepare("SELECT name, balance FROM students WHERE roll=:r");
    query.bindValue(":r", roll);
    if (query.exec() && query.next()) {
        name = query.value(0).toString();
        balance = query.value(1).toDouble();
        return true;
    }
    return false;
}

bool DBManager::addBook(int isbn, const QString& title, const QString& author) {
    QSqlQuery query;
    query.prepare("INSERT INTO books (isbn, title, author, available) VALUES (:i,:t,:a,1)");
    query.bindValue(":i", isbn);
    query.bindValue(":t", title);
    query.bindValue(":a", author);
    return query.exec();
}

bool DBManager::editBook(int isbn, const QString& newTitle, const QString& newAuthor) {
    QSqlQuery query;
    query.prepare("UPDATE books SET title=:t, author=:a WHERE isbn=:i");
    query.bindValue(":t", newTitle);
    query.bindValue(":a", newAuthor);
    query.bindValue(":i", isbn);
    return query.exec();
}

bool DBManager::getBook(int isbn, QString& title, QString& author, bool& available) {
    QSqlQuery query;
    query.prepare("SELECT title, author, available FROM books WHERE isbn=:i");
    query.bindValue(":i", isbn);
    if (query.exec() && query.next()) {
        title = query.value(0).toString();
        author = query.value(1).toString();
        available = query.value(2).toInt() == 1;
        return true;
    }
    return false;
}

bool DBManager::setBookAvailability(int isbn, bool available) {
    QSqlQuery query;
    query.prepare("UPDATE books SET available=:a WHERE isbn=:i");
    query.bindValue(":i", isbn);
    query.bindValue(":a", available ? 1 : 0);
    return query.exec();
}
