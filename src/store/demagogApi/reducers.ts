import { DemagogAnnotationAPIModel, DemagogAnnotationCategories } from '../../api/demagog-annotations';

const initialState = {
  annotations: [
    {
      id: 1,
      attributes: {
        text: 'Jeżeli policjant (to jest ustawa o Policji) dostanie od przełożonego rozkaz, który jest sprzeczny z ' +
        'prawem, ma obowiązek, nie tylko powinien, ale ma obowiązek odmówić wykonania rozkazu.',
        url: 'https://www.polskieradio.pl/13/53/Artykul/2175283,Sygnaly-Dnia-6-sierpnia-2018-roku-rozmowa-z-' +
        'Andrzejem-Halickim',
        sclass: DemagogAnnotationCategories.TRUE,
        date: new Date(),
        rating_text: 'Treść analizy',
      },
    },
  ],
};

export default function textSelector(state = initialState, action) {
  switch (action.type) {
    // TODO add actions
    default:
      return state;
  }
}
