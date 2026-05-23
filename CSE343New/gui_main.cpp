#include "gui_library.h"
#include <QApplication>

int main(int argc, char *argv[]) {
    QApplication a(argc, argv);
    LibraryGUI w;
    w.show();
    return a.exec();
}
