#ifndef GUI_LIBRARY_H
#define GUI_LIBRARY_H

#include <QMainWindow>
#include "dbmanager.h"

QT_BEGIN_NAMESPACE
namespace Ui { class LibraryGUI; }
QT_END_NAMESPACE

class LibraryGUI : public QMainWindow {
    Q_OBJECT

public:
    LibraryGUI(QWidget *parent = nullptr);
    ~LibraryGUI();

private slots:
    void on_addStudentButton_clicked();
    void on_addBookButton_clicked();
    void on_viewStudentsButton_clicked();
    void on_viewBooksButton_clicked();

private:
    Ui::LibraryGUI *ui;
    DBManager *db;
};

#endif // GUI_LIBRARY_H
